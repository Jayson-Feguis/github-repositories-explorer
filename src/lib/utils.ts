function isOperator<T>(value: T): boolean {
  return typeof value === "object" && !Array.isArray(value);
}

function queryStringify<T extends object>(data: T, prefix = ""): string {
  const queryStringSegments: string[] = [];

  if (typeof data === "object") {
    Object.entries(data).forEach(([key, value]) => {
      const updatedPrefix = prefix
        ? `${prefix}[${encodeURIComponent(key)}]`
        : encodeURIComponent(key);

      if (isOperator(value)) {
        if (Array.isArray(value.$or)) {
          (value.$or as T[]).forEach((condition, index) => {
            queryStringSegments.push(
              queryStringify(condition, `${updatedPrefix}[$or][${index}]`)
            );
          });
        } else {
          queryStringSegments.push(queryStringify(value, updatedPrefix));
        }
      } else if (typeof value === "object") {
        queryStringSegments.push(queryStringify(value, updatedPrefix));
      } else {
        queryStringSegments.push(
          `${updatedPrefix}=${encodeURIComponent(value)}`
        );
      }
    });
  }

  return queryStringSegments.join("&");
}

async function wait(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

function dateOffset(offset: number, date: number) {
  const updatedAt = new Date(date);
  return Number(new Date(+updatedAt + offset));
}

export { queryStringify, wait, dateOffset };
