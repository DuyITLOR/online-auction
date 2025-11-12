import { SignInSchema } from '../schema/signInSchema';
import type { SignInFormState, SignUpFormState, VerifyFormState } from '../types/formState';
import { SignUpSchema } from '../schema/signUpSchema';
import { VerifySchema } from '../schema/verifySchema';
import { createSession } from '../session';

export async function SignInFormAction(_state: SignInFormState, formData: FormData): Promise<SignInFormState> {
  const signInForm = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!signInForm.success) {
    return {
      errors: signInForm.error.flatten().fieldErrors,
    };
  }

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sign-in`, {
    method: 'Post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signInForm.data),
  });

  const data = await res.json();

  console.log('data sign in:', data);

  if (!res.ok) {
    return {
      messages: data.message,
    };
  }

  await createSession({
    user: {
      name: data.data.user.fullname,
      email: data.data.user.email,
    },
    token: data.data.token,
  });

  window.location.href = '/';
}

export async function SignUpFormAction(_state: SignUpFormState, formData: FormData): Promise<SignUpFormState> {
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
}

export async function VerifyFormAction(_state: VerifyFormState, formData: FormData): Promise<VerifyFormState> {
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

  window.location.href = '/auth/sign-in';
}
