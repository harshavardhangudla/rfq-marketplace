import express from "express";
import { z } from "zod";
import prisma from "../utils/prisma.js";
import { auth, allowRoles } from "../middleware/auth.js";

const router = express.Router();

const rfqSchema = z.object({
  productName: z.string().min(2, "Product name is required"),
  description: z.string().min(5, "Description is required"),
  quantity: z.coerce.number().int().positive("Quantity must be positive"),
  deliveryLocation: z.string().min(2, "Delivery location is required"),
  deadline: z.string().min(1, "Deadline is required"),
});

/* Create RFQ */
router.post("/", auth, allowRoles("BUYER"), async (req, res) => {
  try {
    const data = rfqSchema.parse(req.body);

    const deadline = new Date(data.deadline);

    if (deadline <= new Date()) {
      return res.status(400).json({
        message: "Deadline must be in the future",
      });
    }

    const rfq = await prisma.rFQ.create({
      data: {
        productName: data.productName,
        description: data.description,
        quantity: data.quantity,
        deliveryLocation: data.deliveryLocation,
        deadline,
        buyerId: req.user.id,
      },
    });

    res.status(201).json({
      message: "RFQ created successfully",
      rfq,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.issues,
      });
    }

    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* Get buyer's RFQs */
router.get("/my", auth, allowRoles("BUYER"), async (req, res) => {
  try {
    const rfqs = await prisma.rFQ.findMany({
      where: {
        buyerId: req.user.id,
      },
      include: {
        quotations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(rfqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* Get all available RFQs for suppliers */
router.get("/", auth, allowRoles("SUPPLIER"), async (req, res) => {
  try {
    const { search = "", location = "" } = req.query;

    const rfqs = await prisma.rFQ.findMany({
      where: {
        deadline: {
          gt: new Date(),
        },
        AND: [
          {
            OR: [
              {
                productName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
          {
            deliveryLocation: {
              contains: location,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        buyer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(rfqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* Get one RFQ */
router.get("/:id", auth, async (req, res) => {
  try {
    const rfq = await prisma.rFQ.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        buyer: {
          select: {
            name: true,
          },
        },
        quotations: {
          include: {
            supplier: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    if (
      req.user.role === "BUYER" &&
      rfq.buyerId !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.json(rfq);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* Update RFQ */
router.put("/:id", auth, allowRoles("BUYER"), async (req, res) => {
  try {
    const data = rfqSchema.parse(req.body);

    const existingRfq = await prisma.rFQ.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!existingRfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    if (existingRfq.buyerId !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own RFQs",
      });
    }

    const deadline = new Date(data.deadline);

    if (deadline <= new Date()) {
      return res.status(400).json({
        message: "Deadline must be in the future",
      });
    }

    const rfq = await prisma.rFQ.update({
      where: {
        id: req.params.id,
      },
      data: {
        productName: data.productName,
        description: data.description,
        quantity: data.quantity,
        deliveryLocation: data.deliveryLocation,
        deadline,
      },
    });

    res.json({
      message: "RFQ updated successfully",
      rfq,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.issues,
      });
    }

    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

/* Delete RFQ */
router.delete("/:id", auth, allowRoles("BUYER"), async (req, res) => {
  try {
    const rfq = await prisma.rFQ.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!rfq) {
      return res.status(404).json({
        message: "RFQ not found",
      });
    }

    if (rfq.buyerId !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own RFQs",
      });
    }

    await prisma.rFQ.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "RFQ deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;