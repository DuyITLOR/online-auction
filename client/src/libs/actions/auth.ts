import { SignInSchema } from '../schema/signInSchema';
import type { SignInFormState, SignUpFormState, VerifyFormState } from '../types/formState';
import { SignUpSchema } from '../schema/signUpSchema';
import { VerifySchema } from '../schema/verifySchema';
import { createSession } from '../session';

export async function SignInFormAction(_state: SignInFormState, formData: FormData): Promise<SignInFormState> {
  try {
    const signInForm = SignInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const token = formData.get('recaptcha') as string;

    if (!token) {
      return {
        messages: 'Vui lòng hoàn thành reCAPTCHA.',
      };
    }

    if (!signInForm.success) {
      return {
        errors: signInForm.error.flatten().fieldErrors,
      };
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sign-in`, {
      method: 'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...signInForm.data, recaptchaToken: token }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        messages: data.message,
      };
    }
    console.log('data sign in:', data);

    await createSession({
      user: {
        name: data.data.user.fullname,
        email: data.data.user.email,
        avatarUrl: data.data.user.avtUrl ?? undefined,
      },
      token: data.data.token,
    });

    window.location.href = '/';
  } catch (error) {
    console.error('[auth-form][form-submit::sign-in]:', error);
    return {
      messages: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.',
    };
  }
}

export async function SignUpFormAction(_state: SignUpFormState, formData: FormData): Promise<SignUpFormState> {
  try {
    const signUpForm = SignUpSchema.safeParse({
      email: formData.get('email'),
    });

    if (!signUpForm.success) {
      return {
        errors: signUpForm.error.flatten().fieldErrors,
      };
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sign-up`, {
      method: 'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signUpForm.data),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        messages: data.message,
      };
    }

    window.location.href = '/auth/verify';
  } catch (error) {
    console.error('[auth-form][form-submit::sign-up]:', error);
    return {
      messages: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.',
    };
  }
}

export async function VerifyFormAction(_state: VerifyFormState, formData: FormData): Promise<VerifyFormState> {
  try {
    const verifyForm = VerifySchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      code: formData.get('code'),
    });

    console.log(verifyForm);

    if (!verifyForm.success) {
      return {
        errors: verifyForm.error.flatten().fieldErrors,
      };
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-email`, {
      method: 'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verifyForm.data),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        messages: data.message,
      };
    }

    await createSession({
      user: {
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
      },
      token: data.token,
    });

    window.location.href = '/auth/signin';
  } catch (error) {
    console.error('[auth-form][form-submit::verify]:', error);
    return {
      messages: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.',
    };
  }
}
