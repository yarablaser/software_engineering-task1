import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import { createUser, findUserByEmail, findUserById } from "../models/User"
import { DevBundlerService } from 'next/dist/server/lib/dev-bundler-service';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // get email and password from input
    const { email, password } = req.body; 

    // check if valid
    if (!email || !password){
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    // check if user already exists
    const user = await findUserByEmail(email);
    if (user){
      res.status(400).json({ error: "email already exists" });
      return;
    }
  
    const newUser: PlatformUser = {
      id: null,
      email,
      password
    };

    const createdUser = await createUser(newUser);
    res.status(200).json({ id: createdUser.id });
    //console.log("BODY:", req.body);
  } catch (err: any) {
    res.status(500).json({ error: "something went wrong during registering" });
  }
};