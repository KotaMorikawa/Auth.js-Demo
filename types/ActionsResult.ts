export type ActionsResult =
  | {
      isSuccess: true;
      message: string;
    }
  | {
      isSuccess: false;
      error: {
        message: string;
      };
    };

export type ActionResultWithData<T> =
  | {
      isSuccess: true;
      message: string;
      data: {
        [key: string]: T;
      };
    }
  | {
      isSuccess: false;
      error: {
        message: string;
      };
    };
