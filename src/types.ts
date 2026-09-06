export type Item = {
  id: string;
  label: string;
};

/** リストの行に出す印。ルーレットは当たり、順番決めは先頭・末尾を指す。 */
export type Mark = "target" | "first" | "last";

export type Marks = Readonly<Record<string, Mark>>;
