const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Admin = require("./models/Admin");
const Cart = require("./models/Cart");

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ShopEZ";

const productsData = [
  {
    title: "Aura Series Headphones",
    description: "A pair of high-end over-ear wireless headphones in a sleek charcoal black matte finish. Features active noise cancellation, premium leather padding, and aluminum accents.",
    mainImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDykhGbdVKKzm1GYyHPbInEg-jRZIMGZgeKEHKAc9Twe_PtVFrhvM2V-LLEIWvcFdGXevmlx4hC3zNqYucsncCxnXFRKb4l0dXXLnqsWVRQgZqu0u7YAcs060EPLTtPluQ6lnCLV2Ox68_ej3-PPSwT7U-FDwQ2iWclaedtampVf0VykTtg-4LI5Wv_Hee9zU9lLM9gxBPN03jdJVOb01zUBJIoddhEZjGjghSWrKn2npluy7cdBNZ-h4lx72_W0rTuWp5p_Iyjwg",
    carousel: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDykhGbdVKKzm1GYyHPbInEg-jRZIMGZgeKEHKAc9Twe_PtVFrhvM2V-LLEIWvcFdGXevmlx4hC3zNqYucsncCxnXFRKb4l0dXXLnqsWVRQgZqu0u7YAcs060EPLTtPluQ6lnCLV2Ox68_ej3-PPSwT7U-FDwQ2iWclaedtampVf0VykTtg-4LI5Wv_Hee9zU9lLM9gxBPN03jdJVOb01zUBJIoddhEZjGjghSWrKn2npluy7cdBNZ-h4lx72_W0rTuWp5p_Iyjwg"
    ],
    sizes: ["One Size"],
    category: "Electronics",
    gender: "unisex",
    price: 299.00,
    discount: 0,
    rating: 4.8
  },
  {
    title: "Minimalist Horizon Watch",
    description: "A minimalist white ceramic luxury watch with a matching wristband. Gold-toned markers and Japanese quartz movement for timeless sophistication.",
    mainImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAv7hP7jfq5VOi37bc7zCWBsUvm9ZkUY0cA3laQrVgYIkbbE8UjX8kOMW19hn5oTHZeXHLgz2RToMNqfjqD8baAEllsm1Ih90BTcGsCSWXkeQnFVe8p1B9QBFJyiMNTadVY_OaCVaY0dJgbMdnLInwZB8oc54gqwZZkqCPwnsOm06j5QUIZrN-fnM9SctgEUoHzq6Kya-9VHe2slEeTdzT3mLNrQNnSlGT19ayAd2b1sPZR80NRig2HDLGXZOCRF_tbQ6JzakbpMA",
    carousel: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAv7hP7jfq5VOi37bc7zCWBsUvm9ZkUY0cA3laQrVgYIkbbE8UjX8kOMW19hn5oTHZeXHLgz2RToMNqfjqD8baAEllsm1Ih90BTcGsCSWXkeQnFVe8p1B9QBFJyiMNTadVY_OaCVaY0dJgbMdnLInwZB8oc54gqwZZkqCPwnsOm06j5QUIZrN-fnM9SctgEUoHzq6Kya-9VHe2slEeTdzT3mLNrQNnSlGT19ayAd2b1sPZR80NRig2HDLGXZOCRF_tbQ6JzakbpMA"
    ],
    sizes: ["One Size"],
    category: "Lifestyle",
    gender: "unisex",
    price: 450.00,
    discount: 0,
    rating: 4.5
  },
  {
    title: "Apex Runner V2",
    description: "A pair of vibrant red high-performance running sneakers. Features breathable mesh, aerodynamic soles, and cushioned support for athletic elegance.",
    mainImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrIpsFh6kprDyCw5ohhZlydwqyb_8jGtheCUqnXjUJh2WqzOxPzCTYv18rEHBJQ10kpdE-HLEsXIorIX9Demls0qB5zV_Yj66cGsphalUk1xykIwzQfeywbrgsyH_rvs1EroSoaUbl0WKBKxkAkQCZChxpe7SSl0w7-TCl8mRvesEYdeIvW9DItzqNpxliFp4Ee70db1R21WAadrqU9qCY0sTjjo3x236tiWfzxJzyzgefwfl3T-BTFob8_ZS_S2Obo9IDfB7h2g",
    carousel: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrIpsFh6kprDyCw5ohhZlydwqyb_8jGtheCUqnXjUJh2WqzOxPzCTYv18rEHBJQ10kpdE-HLEsXIorIX9Demls0qB5zV_Yj66cGsphalUk1xykIwzQfeywbrgsyH_rvs1EroSoaUbl0WKBKxkAkQCZChxpe7SSl0w7-TCl8mRvesEYdeIvW9DItzqNpxliFp4Ee70db1R21WAadrqU9qCY0sTjjo3x236tiWfzxJzyzgefwfl3T-BTFob8_ZS_S2Obo9IDfB7h2g"
    ],
    sizes: ["8", "9", "10", "11"],
    category: "Apparel",
    gender: "men",
    price: 220.00,
    discount: 15,
    rating: 4.2
  },
  {
    title: "Retro Frame X100",
    description: "A vintage-inspired professional digital camera with a large glass lens. Perfect blend of classic tactile feel and cutting-edge optical performance.",
    mainImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2lJmQJa4N6mXppio6P4S_zfsIcXPVjmZj1p4FwqJFoKGVIB-839mmdy8kTYC0sByhWqrSCFVqQDTYe-oOeTvKsUYxcUO2zu1nA5812CHifXhC-oZpQZ9A2Q_UeeJixgm8cxynEtS3DyUCd7U6VpDnxNRfoNyMIWM-uFLSoI2C_AoqVmGubPhoNsBcbu5zx4zmoBC8_I5luIfej2OssPFgsQo6PaGCPHOqBAvaBPp5LG19_MHjtuSpWDDNoytTEQrAT4BNFQWCQ",
    carousel: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2lJmQJa4N6mXppio6P4S_zfsIcXPVjmZj1p4FwqJFoKGVIB-839mmdy8kTYC0sByhWqrSCFVqQDTYe-oOeTvKsUYxcUO2zu1nA5812CHifXhC-oZpQZ9A2Q_UeeJixgm8cxynEtS3DyUCd7U6VpDnxNRfoNyMIWM-uFLSoI2C_AoqVmGubPhoNsBcbu5zx4zmoBC8_I5luIfej2OssPFgsQo6PaGCPHOqBAvaBPp5LG19_MHjtuSpWDDNoytTEQrAT4BNFQWCQ"
    ],
    sizes: ["One Size"],
    category: "Electronics",
    gender: "unisex",
    price: 1199.00,
    discount: 0,
    rating: 4.7
  },
  {
    title: "Oslo Classic Frames",
    description: "Luxury tortoiseshell designer sunglasses with high-quality acetate finish and gold hardware. Delivers 100% UV protection and high-contrast visuals.",
    mainImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_947Ir6KG7JxJcILQJaJWAt1bXuoK9Qtnxq4_3ZGmG2J4laZoYnY0SAO0iRai1Pn04ulLDxmhvU57i77pO77cPSENnPmwpgABu-AaY0NqQ-7OZDS3JC1Vjt9gTa5WNfSjSMEuTGIXHGJ-0AXgaBqfBl2YNJtZinXYOpE88lqh4qVBjuDrNVyUJx8NUIpA1cpu82e5F7nlZR_ExR3vENw4mT3jUPMAx5_pW7lpWXA54wyRWGPPg46FcmlmpnB3upgyvDAymc_49g",
    carousel: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_947Ir6KG7JxJcILQJaJWAt1bXuoK9Qtnxq4_3ZGmG2J4laZoYnY0SAO0iRai1Pn04ulLDxmhvU57i77pO77cPSENnPmwpgABu-AaY0NqQ-7OZDS3JC1Vjt9gTa5WNfSjSMEuTGIXHGJ-0AXgaBqfBl2YNJtZinXYOpE88lqh4qVBjuDrNVyUJx8NUIpA1cpu82e5F7nlZR_ExR3vENw4mT3jUPMAx5_pW7lpWXA54wyRWGPPg46FcmlmpnB3upgyvDAymc_49g"
    ],
    sizes: ["One Size"],
    category: "Apparel",
    gender: "unisex",
    price: 210.00,
    discount: 0,
    rating: 4.1
  },
  {
    title: "Sonic Sphere Hub",
    description: "A high-end smart speaker with woven fabric texture. Ethereal acoustics and smart voice command integration for immersive modern living.",
    mainImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDG4KfLpxsVcFlCZFtHX4Xb2fBG-PNJ241rWr4A2pzWAfy0UBTpPIe-tWXyvlysGGPtN5_10AdqsCLLopyCReD0Bzb_vt9QjEtgrIqJI3fXpyfJIlaAi-pADxsWsmec8I2MuDgun-_GBlOBylSHOCFj0v9IvO0v9emceJP2kGuNCI8NetXCLMzCXpE50M7Auzc9oWFUg4cZTEyNBE3ZjIjBLgHJiTS1mJOqstHe6nxR-fMHdBoykxBvnFE8eyrj_lJKcsyCOB0kXA",
    carousel: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDG4KfLpxsVcFlCZFtHX4Xb2fBG-PNJ241rWr4A2pzWAfy0UBTpPIe-tWXyvlysGGPtN5_10AdqsCLLopyCReD0Bzb_vt9QjEtgrIqJI3fXpyfJIlaAi-pADxsWsmec8I2MuDgun-_GBlOBylSHOCFj0v9IvO0v9emceJP2kGuNCI8NetXCLMzCXpE50M7Auzc9oWFUg4cZTEyNBE3ZjIjBLgHJiTS1mJOqstHe6nxR-fMHdBoykxBvnFE8eyrj_lJKcsyCOB0kXA"
    ],
    sizes: ["One Size"],
    category: "Electronics",
    gender: "unisex",
    price: 325.00,
    discount: 0,
    rating: 4.4
  },
  {
    title: "Origin Espresso Brewer",
    description: "A minimalist black espresso machine made of brushed steel and matte ceramic. Creates rich, artisanal coffee at home with precise pressure controls.",
    mainImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWublJ8kVy1LGtNAPRAHV_bszcEAM1Hycc1_MHp6sXsLS9p5n5JbuK7_n3O6nL-yB8edLmU0Zl43BgCxjj9aaIx8jp1oHjY2UOIvk06tUvQGL_eFoVkFdGPRKbd1nr8JeoY1lm7BgNTRAgvFJ1Tie6kybZiTthc6DIOGZUQjiTXh1hSeQ9CIt9nq7IjmU7GE22bMlusVnuiKPCir8URN7FN339qqXM_gPNdD_f32gMvLFcxasP_wjmaXLTJnwRlnwY8hw9CQh5Kw",
    carousel: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWublJ8kVy1LGtNAPRAHV_bszcEAM1Hycc1_MHp6sXsLS9p5n5JbuK7_n3O6nL-yB8edLmU0Zl43BgCxjj9aaIx8jp1oHjY2UOIvk06tUvQGL_eFoVkFdGPRKbd1nr8JeoY1lm7BgNTRAgvFJ1Tie6kybZiTthc6DIOGZUQjiTXh1hSeQ9CIt9nq7IjmU7GE22bMlusVnuiKPCir8URN7FN339qqXM_gPNdD_f32gMvLFcxasP_wjmaXLTJnwRlnwY8hw9CQh5Kw"
    ],
    sizes: ["One Size"],
    category: "Home Decor",
    gender: "unisex",
    price: 890.00,
    discount: 0,
    rating: 4.9
  },
  {
    title: "Urban Ghost High-Tops",
    description: "Premium high-top fashion sneakers in cream and white leather. Features high-gloss reflections, comfortable cushioning, and street-ready style.",
    mainImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2P97H4_r-2MgVEDCTa8bcXPJjb3UH-N-QLSAXTTQKwne_tKBK0cHzEd-qZEy_z4KsXpLgpCWOahArGgqDck3Q8YsFL0uFZckqUOYtGB88N-RO5_PdjEfPHjPIsCF2aehTYLHv2cT7vL8nZ3CYw4IauKZIMvPPJnIkApQrWzfx4PYlu0inANNllQX2ixDx6bYbnZD-WLKPrXwg5uGyKhxvyPGDrNBAIS5_16lM2gzKkJHai4yyzwAK06lMnm6JsLanPpyp6C768w",
    carousel: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2P97H4_r-2MgVEDCTa8bcXPJjb3UH-N-QLSAXTTQKwne_tKBK0cHzEd-qZEy_z4KsXpLgpCWOahArGgqDck3Q8YsFL0uFZckqUOYtGB88N-RO5_PdjEfPHjPIsCF2aehTYLHv2cT7vL8nZ3CYw4IauKZIMvPPJnIkApQrWzfx4PYlu0inANNllQX2ixDx6bYbnZD-WLKPrXwg5uGyKhxvyPGDrNBAIS5_16lM2gzKkJHai4yyzwAK06lMnm6JsLanPpyp6C768w"
    ],
    sizes: ["7", "8", "9", "10", "11"],
    category: "Apparel",
    gender: "unisex",
    price: 275.00,
    discount: 0,
    rating: 4.6
  }
];

async function seed() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");

    // Clear existing products and cart items
    await Product.deleteMany({});
    await Cart.deleteMany({});
    console.log("Existing products and cart cleared.");

    // Seed products
    const seededProducts = await Product.insertMany(productsData);
    console.log(`${seededProducts.length} products successfully seeded!`);

    // Create users/admins if they don't exist
    const adminEmail = "admin@shopez.com";
    const customerEmail = "customer@shopez.com";

    await User.deleteMany({ email: { $in: [adminEmail, customerEmail] } });
    await Admin.deleteMany({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("admin123", salt);
    const hashedCustomerPassword = await bcrypt.hash("customer123", salt);

    await Admin.create({
      username: "ShopEZ Admin",
      email: adminEmail,
      password: hashedAdminPassword,
      userType: "admin"
    });

    await User.create({
      username: "John Doe",
      email: customerEmail,
      password: hashedCustomerPassword,
      userType: "customer"
    });
    console.log("Admin and Customer users successfully seeded!");
    console.log(`Admin user: ${adminEmail} (password: admin123)`);
    console.log(`Customer user: ${customerEmail} (password: customer123)`);

  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
    process.exit(0);
  }
}

seed();
