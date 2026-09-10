import express from "express";
import { z } from "zod";
import prisma from "../utils/prisma.js";
import { auth, allowRoles } from "../middleware/auth.js";

const router = express.Router();

const quotationSchema = z.object({
  rfqId: z.string().min(1),
  quotedPrice: z.number().positive(),
  deliveryTime: z.string().min(1),
  message: z.string().optional(),
});

// Supplier: submit quotation
router.post("/", auth, allowRoles("SUPPLIER"), async (req, res) => {
  try {
    const data = quotationSchema.parse(req.body);

    const rfq = await prisma.rFQ.findUnique({
      where: {
        id: data.rfqId,
      },
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    if (new Date(rfq.deadline) < new Date()) {
      return res.status(400).json({
        message: "Quotation deadline has passed",
      });
    }

    const existing = await prisma.quotation.findUnique({
      where: {
        rfqId_supplierId: {
          rfqId: data.rfqId,
          supplierId: req.user.id,
        },
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "You already submitted a quotation for this RFQ",
      });
    }

    const quotation = await prisma.quotation.create({
      data: {
        rfqId: data.rfqId,
        supplierId: req.user.id,
        quotedPrice: data.quotedPrice,
        deliveryTime: data.deliveryTime,
        message: data.message,
      },
    });

    res.status(201).json({
      message: "Quotation submitted successfully",
      quotation,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.issues,
      });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Supplier: view submitted quotations
router.get("/my", auth, allowRoles("SUPPLIER"), async (req, res) => {
  try {
    const quotations = await prisma.quotation.findMany({
      where: {
        supplierId: req.user.id,
      },
      include: {
        rfq: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            deliveryLocation: true,
            deadline: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(quotations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;