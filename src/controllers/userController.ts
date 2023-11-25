import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';

// Create a new user
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

    // Hash the password before saving it to the database
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
      orders: [], // Assuming orders are initially empty for a new user
    });

    // Return the created user without the password field in the response
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

// Get all users
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

// Get a specific user by ID
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

// Update user information
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

    // Update user information based on updatedUserData
    Object.assign(user, updatedUserData);
    await user.save();

    // Return updated user without the password field
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

// Delete a user
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

//----------------------
// Get a specific user by ID
// export const getUserById = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.userId;
//     const user = await UserModel.findOne({ userId }, '-password');

//     if (!user) {

//calculate price of orders
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

    // Fetch the user's orders and calculate total price
    const userOrders = user.orders || [];
    let totalPrice = 0;
    userOrders.forEach((order) => {
      totalPrice += order.price * order.quantity;
    });

    res.json({
      success: true,
      message: 'Total price calculated successfully!',
      data: {
        totalPrice: totalPrice.toFixed(2), // Return total price with two decimal places
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
// export const calculateTotalPrice = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.userId;

//     // Check if the user exists in the database
//     const user = await UserModel.findOne({ userId }, '-password');
export const getAllOrdersForUser = async (req: Request, res: Response) => {
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

    // Retrieve the user's orders
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
