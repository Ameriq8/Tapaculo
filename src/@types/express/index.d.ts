import express from "express";

declare global {
  namespace Express {
    interface Request {
      email: string;
      user?: Record<string,any>;
    }
  }
}