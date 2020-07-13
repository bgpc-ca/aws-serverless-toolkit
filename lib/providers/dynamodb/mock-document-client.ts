export class MockDocumentClient {
  batchGet(): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  delete(): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }

  query(): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  scan(): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  transactGet(): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  transactWrite(): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
  update(): { promise: () => Promise<void> } {
    return {
      promise: async function () {
        return;
      },
    };
  }
}
export const mockDocumentClient = {};
