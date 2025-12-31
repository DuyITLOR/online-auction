export type SignInFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      messages?: string;
      success?: boolean;
      role?: string;
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
        address?: string[];
        password?: string[];
        code?: string[];
      };
      messages?: string;
    }
  | undefined;

export type ForgetPasswordFormState =
  | {
      errors?: {
        email?: string[];
      };
      messages?: string;
    }
  | undefined;

export type ResetPasswordFormState =
  | {
      errors?: {
        password?: string[];
      };
      messages?: string;
    }
  | undefined;
