import fetch from "isomorphic-unfetch";

export const fetcher = async (...args: any[]) =>
  // @ts-ignore argument spreading isn't playing nice with fetch
  fetch(...args).then((res) => res.json());
