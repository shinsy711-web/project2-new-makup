#!/usr/bin/env node
/**
 * IndexNow 색인 요청 — 네이버·빙에 "이 URL들을 다시 수집하라"고 즉시 알린다.
 *
 * 네이버는 2023년부터 IndexNow를 지원한다. 사이트맵·RSS가 "와서 읽어가길 기다리는"
 * 방식이라면 IndexNow는 이쪽에서 먼저 찔러주는 방식이라 반영이 훨씬 빠르다.
 *
 * 대상 URL은 로컬 레지스트리가 아니라 '배포된 sitemap.xml'에서 읽는다.
 * 아직 배포되지 않은 URL을 색인 요청하면 크롤러가 404를 받고,
 * 그게 쌓이면 사이트 전체 수집 품질 점수가 깎이기 때문이다.
 *
 * 사용법:  npm run indexnow
 */

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://makeuphagwon.kr').replace(/\/$/, '');
const KEY = '949413ecc2f0384fed0db620e8e3a8a7';

const ENDPOINTS = [
  ['네이버', 'https://searchadvisor.naver.com/indexnow'],
  ['IndexNow 공용(빙 등)', 'https://api.indexnow.org/indexnow'],
];

/** IndexNow 1회 요청 상한 */
const MAX_URLS = 10000;

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * 키 파일이 실제로 서빙되는지 먼저 확인한다.
 * 이게 없으면 엔드포인트는 422만 돌려주고 이유를 알려주지 않아서,
 * 색인 요청이 조용히 전부 버려지는 상황을 눈치채기 어렵다.
 */
async function verifyKey() {
  const url = `${SITE}/${KEY}.txt`;
  const res = await fetch(url).catch((e) => {
    throw new Error(`키 파일 요청 실패: ${url}\n  ${e.message}`);
  });
  if (!res.ok) {
    throw new Error(`키 파일이 서빙되지 않는다 (${res.status}): ${url}\n  public/${KEY}.txt 가 배포됐는지 확인할 것.`);
  }
  const body = (await res.text()).trim();
  if (body !== KEY) {
    throw new Error(`키 파일 내용이 키와 다르다: ${url}\n  기대값 ${KEY} / 실제값 ${body.slice(0, 40)}`);
  }
  console.log(`✓ 키 파일 확인  ${url}`);
}

async function collectUrls() {
  const url = `${SITE}/sitemap.xml`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`사이트맵을 읽을 수 없다 (${res.status}): ${url}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error(`사이트맵에 <loc>이 하나도 없다: ${url}`);

  // 호스트가 다른 URL이 섞이면 엔드포인트가 요청 전체를 422로 거절한다.
  const host = new URL(SITE).host;
  const foreign = urls.filter((u) => new URL(u).host !== host);
  if (foreign.length) {
    throw new Error(`사이트맵에 다른 호스트 URL이 섞여 있다 (${foreign.length}건): ${foreign[0]}`);
  }
  return urls;
}

async function submit(label, endpoint, urlList) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList,
    }),
  });
  // 200 즉시 수락 / 202 수락 후 키 검증 대기 — 둘 다 정상이다.
  const ok = res.status === 200 || res.status === 202;
  const detail = ok ? '' : `  ← ${(await res.text()).slice(0, 200)}`;
  console.log(`${ok ? '✓' : '✗'} ${label.padEnd(22)} HTTP ${res.status}  (${urlList.length}건)${detail}`);
  return ok;
}

async function main() {
  console.log(`\nIndexNow 색인 요청 — ${SITE}\n`);
  await verifyKey();

  const urls = await collectUrls();
  console.log(`✓ 사이트맵에서 URL ${urls.length}건 수집\n`);

  let allOk = true;
  for (const batch of chunk(urls, MAX_URLS)) {
    for (const [label, endpoint] of ENDPOINTS) {
      const ok = await submit(label, endpoint, batch);
      allOk = allOk && ok;
    }
  }

  console.log(
    allOk
      ? '\n완료. 네이버 웹마스터도구 › 요청 › 웹 페이지 수집에서 반영 상태를 확인할 수 있다.\n'
      : '\n일부 엔드포인트가 거절했다. 위 응답 본문을 확인할 것.\n'
  );
  process.exit(allOk ? 0 : 1);
}

main().catch((e) => {
  console.error(`\n✗ ${e.message}\n`);
  process.exit(1);
});
