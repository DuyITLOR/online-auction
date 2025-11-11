export type SignInFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      messages?: string;
    }
  | undefined;

export type SignUpFormState =
  | {
      errors?: {
        email?: string[];
      };
      messages?: string;
    }
  | undefined;

export type VerifyFormState =
  | {
      errors?: {
        email?: string[];
        name?: string[];
        password?: string[];
        code?: string[];
      };
      messages?: string;
    }
  | undefined;
