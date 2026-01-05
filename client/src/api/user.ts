import { getSession } from "../libs/session";

export const getRole = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || "Failed in check role api";
      throw new Error(message);
    }

    return data.data.user;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const requestToUpgrade = async ({
  note,
  token,
}: {
  note: string;
  token: string;
}) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/upgrade`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const message =
        data.message || data.error || "Failed to fetch api upgrade role";
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

interface UpdateUserPayload {
  fullname: string;
  email: string;
  avatar: File;
  dateOfBirth: string;
  address: string;
}

export const updateUser = async ({
  user,
  token,
}: {
  user: UpdateUserPayload;
  token: string;
}) => {
  try {
    const formData = new FormData();

    formData.append("fullname", user.fullname);
    formData.append("email", user.email);
    formData.append("avatar", user.avatar);
    formData.append("dateOfBirth", user.dateOfBirth);
    formData.append("address", user.address);

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/update`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const message =
        data.message || data.error || "Failed to fetch update user api";

      throw new Error(message);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getStatisticProfile = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/bidder/statistic`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      const message =
        data.message || data.error || "Failed to get information profile api";
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getUser = async ({ id }: { id: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.message || data.error || "Failed to fetch user";
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getUserStatistic = async ({ id }: { id: string }) => {
  try {
    const session = await getSession();
    //
    const token = session?.token || "";
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/bidder/statistic/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      const message =
        data.message || data.error || "Failed to fetch user statistic";
      throw new Error(message);
    }
    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
