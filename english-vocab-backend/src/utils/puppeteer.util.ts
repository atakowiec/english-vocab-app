import puppeteer, { Browser, Page } from 'puppeteer';

let page: Page | null = null;
let browser: Browser | null = null;

export async function getPage() {
  if (!page) {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  }

  return page;
}

export async function openPage(url: string) {
  const page = await getPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  return page;
}

export async function closePage() {
  if (page) {
    await page.close();
    page = null;
  }
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }

  await closePage();
}

export function evaluate(): FetchResponse {
  function querySelectorAllText(selector: string, base: ParentNode): string[] {
    return [...base.querySelectorAll<HTMLElement>(selector)].filter(Boolean).map((e) => e.innerText);
  }

  const allTypes = [...document.querySelectorAll<HTMLElement>(`.pr.dictionary[data-id="cldpl"] .entry-body__el`)];
  const otherForms: string[] = [];

  const words = allTypes
    .map((type) => {
      let word = type.querySelector<HTMLElement>('.di-title')!.innerText;
      const typeText = type.querySelector<HTMLElement>('.pos.dpos')?.innerText;
      otherForms.push(...querySelectorAllText('.inf.dinf', type), word);

      return [...type.querySelectorAll<HTMLElement>('.sense-block')].map((translationBlock) => {
        const isDifferent = !!translationBlock.querySelector('.sense-body .dphrase-block');
        const otherWord = translationBlock.querySelector<HTMLElement>('.phrase.dphrase')?.innerText;
        word = isDifferent && otherWord ? otherWord : word;

        const tags = querySelectorAllText('.gc.dgc', translationBlock);
        const level = translationBlock.querySelector<HTMLElement>('.def-head .epp-xref')?.innerText;
        const definition = translationBlock.querySelector<HTMLElement>('.def-block .def.ddef_d')?.innerText;
        const translation = translationBlock.querySelector<HTMLElement>('.def-block .trans.dtrans')?.innerText;
        const examples = querySelectorAllText('.def-block .examp.dexamp .eg.deg', translationBlock);

        return {
          word,
          tags,
          definition,
          translation,
          level,
          examples,
          type: typeText,
          otherForms: [...new Set([...otherForms, word])],
        };
      });
    })
    .flat();

  const toFetch = [...document.querySelectorAll<HTMLAnchorElement>('a')]
    .map((a) => a.href)
    .filter((u) => u.startsWith('https://dictionary.cambridge.org/dictionary/english-polish/'))
    .map((u) => u.replace('https://dictionary.cambridge.org/dictionary/english-polish/', ''))
    .filter(Boolean)
    .filter((u) => !u.includes('?') && !u.includes('#'));

  return {
    words,
    toFetch,
  };
}

export type FetchResponse = {
  words: {
    word: string | undefined;
    tags: string[];
    definition: string | undefined;
    translation: string | undefined;
    level: string | undefined;
    examples: string[];
    type: string | undefined;
    otherForms: string[];
  }[];
  toFetch: string[];
};
