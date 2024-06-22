export const useCurPath = (x) => {
    return useState("curpath", () => x||"/");
  };
  