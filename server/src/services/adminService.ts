import { prisma } from "./db/prisma";
import { getAllUsersServiceDto } from "../dto/adminDto";

export const getAllUsers = async (data: getAllUsersServiceDto) => {
  try {
    let users;

    if (data.limit <= 0) {
      users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullname: true,
          role: true,
          createdAt: true,
        },
      });
    } else {
      users = await prisma.user.findMany({
        orderBy: { createdAt: "asc" },
        skip: data.page * data.limit,
        take: data.limit,
        select: {
          id: true,
          email: true,
          fullname: true,
          role: true,
          createdAt: true,
        },
      });
    }

    const totalItems = await prisma.user.count();
    let pages = Math.ceil(totalItems / data.limit);
    if (data.limit <= 0) pages = 1;

    return {
      success: true,
      users: {
        users,
        totalPages: pages,
        totalUsers: totalItems,
      },
      message: "Get users successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const getAllRequest = async (data: getAllUsersServiceDto) => {
  try {
    let requests;

    if (data.limit <= 0) {
      requests = await prisma.upgradeRequests.findMany({
        include: {
          user: {
            select: {
              fullname: true,
              email: true,
            },
          },
        },
      });
    } else {
      requests = await prisma.upgradeRequests.findMany({
        orderBy: { createdAt: "desc" },
        skip: data.page * data.limit,
        take: data.limit,
        include: {
          user: {
            select: {
              fullname: true,
              email: true,
            },
          },
        },
      });
    }

    const totalItems = await prisma.upgradeRequests.count();
    let pages = Math.ceil(totalItems / data.limit);
    if (data.limit <= 0) pages = 1;

    return {
      success: true,
      requests: {
        requests,
        totalPages: pages,
        totalRequests: totalItems,
      },
      message: "Get requests successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const acceptRequest = async (id: string) => {
  try {
    const decidedAt = new Date();
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const record = await prisma.upgradeRequests.update({
      where: { id },
      data: {
        status: "VALID",
        decidedAt,
        expiredAt,
      },
      include: {
        user: {
          select: {
            fullname: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      data: record,
      message: "Accept request successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const refuseRequest = async (id: string) => {
  try {
    const record = await prisma.upgradeRequests.update({
      where: { id },
      data: {
        status: "FAILED",
      },
      include: {
        user: {
          select: {
            fullname: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      data: record,
      message: "Refuse request successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const getAdminDashboardData = async () => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.products.count();
    const completedOrders = await prisma.orders.count({
      where: { status: "COMPLETED" },
    });
    const revenueAgg = await prisma.orders.aggregate({
      _sum: { totalAmount: true },
      where: { status: "COMPLETED" },
    });
    const revenue = revenueAgg._sum.totalAmount || 0;
    return {
      success: true,
      data: {
        totalUsers,
        totalProducts,
        completedOrders,
        revenue,
      },
      message: "Get dashboard data successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
