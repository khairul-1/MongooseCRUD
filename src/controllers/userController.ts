import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';

//............. create user ..........

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      username,
      password,
      fullName,
      age,
      email,
      isActive,
      hobbies,
      address,
    } = req.body;

    //..... password protected.............
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      userId,
      username,
      password: hashedPassword,
      fullName,
      age,
      email,
      isActive,
      hobbies,
      address,
      orders: [],
    });

    const { password: omitPassword, ...userWithoutPassword } =
      newUser.toObject();
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: userWithoutPassword,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
};

// -------------query all user from database-------------------
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find(
      {},
      'username fullName age email address',
    );

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// ----Query a single user----------------
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findOne({ userId }, '-password');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully!',
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

//--------user info update-----------

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    Object.assign(user, updatedUserData);
    await user.save();

    const { password: omitPassword, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: userWithoutPassword,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

// --------delete user----------------

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await UserModel.findOneAndDelete({ userId });

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

//----------price of orders------------------

export const calculateTotalPrice = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists in the database
    const user = await UserModel.findOne({ userId }, '-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
      return;
    }

    const userOrders = user.orders || [];
    let totalPrice = 0;
    userOrders.forEach((order) => {
      totalPrice += order.price * order.quantity;
    });

    res.json({
      success: true,
      message: 'Total price calculated successfully!',
      data: {
        totalPrice: totalPrice.toFixed(2),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: {
        code: 500,
        description: error.message,
      },
    });
  }
};

//-------------all orders of a user-------

export const getAllOrdersForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await UserModel.findOne({ userId }, '-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
      return;
    }

    const userOrders = user.orders || [];

    if (userOrders.length === 0) {
      res.json({
        success: true,
        message: 'No orders found for the user',
        data: {
          orders: [],
        },
      });
      return;
    }

    res.json({
      success: true,
      message: 'Orders fetched successfully!',
      data: {
        orders: userOrders,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: {
        code: 500,
        description: error.message,
      },
    });
  }
};

//==== New order add-----

export const addNewProductInOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { productName, price, quantity } = req.body;

    const user = await UserModel.findOne({ userId }, '-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
      return;
    }

    const newOrder = {
      productName,
      price,
      quantity,
    };

    if (user.orders) {
      user.orders.push(newOrder);
    } else {
      user.orders = [newOrder];
    }

    await user.save();

    res.json({
      success: true,
      message: 'Order created successfully!',
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: {
        code: 500,
        description: error.message,
      },
    });
  }
};
