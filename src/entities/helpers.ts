import { HASHTAG_REGEX } from "./constants";

export function findTags(text: string): string[] {
  const hashtags: string[] = [];
  let match = null;

  while ((match = HASHTAG_REGEX.exec(text)) !== null) {
    if (!hashtags.includes(match[0].slice(1))) {
      hashtags.push(match[0].slice(1).toLocaleLowerCase().trim());
    }
  }

  const uniqueHashtags = hashtags.filter(function (item, pos) {
    return hashtags.indexOf(item) === pos;
  });

  return uniqueHashtags;
}

export const sortTagsBySearch = (tags: string[], text: string): string[] =>
  tags.filter((tag) => tag.toLowerCase().includes(text.toLowerCase())).sort();
export const subArrInArr = (arr: string[], subArr: string[]): boolean =>
  subArr.every((e) => arr.includes(e));
