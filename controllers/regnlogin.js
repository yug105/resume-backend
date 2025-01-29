const {db} = require("../db/dbclient");
const { eq } = require("drizzle-orm");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { users } = require("../db/schema");


const omitPassword = (user) => {
  const { password, ...rest } = user;
  return rest;
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const [existing] = await db.select()
      .from(users)
      .where(eq(users.email, email));

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const [user] = await db.insert(users)
      .values({ email, password: hashedPassword })
      .returning();

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      user: omitPassword(user),
      token
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }


    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }


    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    

    res.json({ 
      user: omitPassword(user),
      token 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};