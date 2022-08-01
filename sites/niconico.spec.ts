import { test, expect, type Page } from "@playwright/test"
import { readHistoryUrl, addRecord, saveFile } from "./utils.ts"
import { defaultOptions, parser, toLayout, toAss } from "../src/index.js"

// uncomment and configure below if using proxy
test.use({
  proxy: {
    server: 'http://localhost:11223',
  }
})

interface BangumiConfig {
  homePage: string　//ニコニコ番組チャンネル
  name?: string //番組名
  savePath?: string //保存位置
  locator?: string
  commentUrl?: RegExp
}

function definedBangumi(config: BangumiConfig): BangumiConfig {
  const urlRegex = /nicovideo.jp\/detail\/(.+)\/index/
  const shortName = urlRegex.exec(config.homePage)?.[1]
  if (!shortName) throw "Not a valid homePage"

  const defaultConfig: BangumiConfig = {
    homePage: config.homePage,
    name: shortName,
    savePath: `archive/${shortName}/`,
    locator: `section >> nth=0 >> a[href^="https://www.nicovideo.jp/watch"]`,
    commentUrl: /nvcomment.nicovideo.jp\/(api\.json|v1\/threads)/
  }

  return { ...defaultConfig, ...config }
}

test("ようこそ実力至上主義の教室へ", async ({ page }) => {
  const config = definedBangumi({
    name: "ようこそ実力至上主義の教室へ 2nd Season",
    homePage: "https://anime.nicovideo.jp/detail/you-zitsu2/index.html",
    savePath: "archive/you-zitsu2/",
  })

  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  let links = await getVideoLinks(page, config)
  links = filterNewLink(links)

  console.log(`INFO: ${links.length}(new) / ${links.length}(free) `)

  for await (const link of links) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})


test("惑星のさみだれ", async ({ page }) => {
  const config = definedBangumi({
    name: "惑星のさみだれ",
    homePage: "https://anime.nicovideo.jp/detail/hoshinosamidare/index.html",
    savePath: "archive/hoshinosamidare/",
  })

  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  let links = await getVideoLinks(page, config)

  links = filterNewLink(links)

  console.log(`INFO: ${links.length}(new) / ${links.length}(free) `)

  for await (const link of links) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})


test("ダンジョンに出会いを求めるのは間違っているだろうかⅣ", async ({ page }) => {
  const config = definedBangumi({
    name: "ダンジョンに出会いを求めるのは間違っているだろうかⅣ",
    homePage: "https://anime.nicovideo.jp/detail/danmachi4/index.html",
  })


  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  const links = await getVideoLinks(page, config)

  const newLinks = filterNewLink(links)

  console.log(`INFO: ${newLinks.length}(new) / ${links.length}(free) `)

  for await (const link of newLinks) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})

test("シャドーハウス2nd Season", async ({ page }) => {
  const config = definedBangumi({
    name: "シャドーハウス2nd Season",
    homePage: "https://anime.nicovideo.jp/detail/shadowshouse2/index.html",
  })

  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  const links = await getVideoLinks(page, config)

  const newLinks = filterNewLink(links)

  console.log(`INFO: ${newLinks.length}(new) / ${links.length}(free) `)

  for await (const link of newLinks) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})


test("邪神ちゃんドロップキックX", async ({ page }) => {
  const config = definedBangumi({
    name: "邪神ちゃんドロップキックX",
    homePage: "https://anime.nicovideo.jp/detail/jashinchan3/index.html",
  })

  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  const links = await getVideoLinks(page, config)

  const newLinks = filterNewLink(links)

  console.log(`INFO: ${newLinks.length}(new) / ${links.length}(free) `)

  for await (const link of newLinks) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})



test("彼女、お借りします", async ({ page }) => {
  const config = definedBangumi({
    name: "彼女、お借りします 第2期",
    homePage: "https://anime.nicovideo.jp/detail/kanokari-official2/index.html",
    savePath: "archive/kanokari2/",
  })


  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  const links = await getVideoLinks(page, config)

  const newLinks = filterNewLink(links)

  console.log(`INFO: ${newLinks.length}(new) / ${links.length}(free) `)

  for await (const link of newLinks) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})


test("Engage Kiss", async ({ page }) => {
  const config = definedBangumi({
    name: "Engage Kiss",
    homePage: "https://anime.nicovideo.jp/detail/engage-kiss/index.html",
  })

  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  const links = await getVideoLinks(page, config)

  const newLinks = filterNewLink(links)

  console.log(`INFO: ${newLinks.length}(new) / ${links.length}(free) `)

  for await (const link of newLinks) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})


test("異世界迷宮でハーレムを", async ({ page }) => {
  const config = definedBangumi({
    name: "異世界迷宮でハーレムを",
    homePage: "https://anime.nicovideo.jp/detail/isekai-harem/index.html",
  })

  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  const links = await getVideoLinks(page, config)

  const newLinks = filterNewLink(links)

  console.log(`INFO: ${newLinks.length}(new) / ${links.length}(free) `)

  for await (const link of newLinks) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})

test("異世界おじさん", async ({ page }) => {
  const config = definedBangumi({
    name: "異世界おじさん",
    homePage: "https://anime.nicovideo.jp/detail/isekaiojisan/index.html",
  })

  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  const links = await getVideoLinks(page, config)

  const newLinks = filterNewLink(links)

  console.log(`INFO: ${newLinks.length}(new) / ${links.length}(free) `)

  for await (const link of newLinks) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})

test("オーバーロードⅣ", async ({ page }) => {
  const config = definedBangumi({
    name: "オーバーロードⅣ",
    homePage: "https://anime.nicovideo.jp/detail/overlord-anime4/index.html",
    savePath: "archive/overlord4/",
  })

  await page.goto(config.homePage, { waitUntil: "domcontentloaded" })

  const links = await getVideoLinks(page, config)

  const newLinks = filterNewLink(links)

  console.log(`INFO: ${newLinks.length}(new) / ${links.length}(free) `)

  for await (const link of newLinks) {
    await page.goto(link, { waitUntil: "domcontentloaded" })
    const title = (await page.title()).split("-")[0].trim()
    await Promise.all([
      page.reload({ waitUntil: "domcontentloaded" }),
      page.waitForResponse(async (res) => {
        return niconicoCommentsHandler(res, config, title, page.url())
      }),
    ])
  }
})

async function getVideoLinks(page, config) {
  await page.route("**/*.{png,jpg,jpeg}", (route) => route.abort()) //No image
  const anchors = page.locator(config.locator).filter({
    has: page.locator(`[data-video-type="free"]`), // Free only
  })

  return await anchors.evaluateAll((els) =>
    els.map((e) => e.getAttribute("href"))
  )
}

async function niconicoCommentsHandler(res, config, title, url) {
  const link = res.url()
  const isComment = config.commentUrl.test(link)
  if (isComment) {
    const rawBody = await res.body()
    const { thread, danmaku: content } = parser.niconico(rawBody)
    const name = `${title}`
    const item = {
      id: thread,
      meta: { name, url },
      content: content,
      layout: await toLayout(content, defaultOptions),
    }
    let ass = toAss(item, defaultOptions)
    console.log(`saving...${name}.ass`)
    const fileName = saveFile(config.savePath, name, "ass", ass)
    saveFile(config.savePath, name, "json", String(rawBody))
    addRecord(url, config.savePath + fileName, config.name)
  }
  return isComment
}

function filterNewLink(links) {
  const historyUrl = readHistoryUrl()
  if (historyUrl.length === 0) return links
  return links.filter((link) => {
    if (!link) return false
    return !historyUrl.some((h) => link.startsWith(h))
  })
}
