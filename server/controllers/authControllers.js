import dotenv from "dotenv"
import nodemailer from "nodemailer"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if(!name) 
            return res.status(400).json({ message: 'name is required'})

        if(!password || password.length < 6) 
            return res.status(400).json({ message: 'Password is required and should be more than 6 characters long'})
        
        const exists = await User.findOne({ email })
        if(exists) 
            return res.status(400).json({ message: "Email already registered"})
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const verificationToken = jwt.sign({ email }, process.env.JWT_EMAIL_SECRET, {
            expiresIn: "1d"
        })

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            verified: false,
            verificationToken
        })
        await user.save()

        const verifyUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Verify your account",
            html: `
                <h2>Welcome, ${name}!</h2>
                <p>Please verify your email by clicking the link below:</p>
                <a href= "${verifyUrl}">${verifyUrl}</a>
                <p>This link expires in 24 hours.</p>
            `
        })

        res.json({ message: "Registration successful, We have sent you a email for verification."})
    } catch (error) {
        console.error("Registration error:", error)
        res.status(500).json({ error: "Server error during registration."})
    }
}

const emailVerifyToken = async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_EMAIL_SECRET)
        const user = await User.findOne({ email: decoded.email })

        if(!user)
            return res.status(400).send("Invalid verification token.")
        
        if(user.verified){
            return res.send("Email already verified.")
        }
        
        user.verified = true
        user.verificationToken = null
        await user.save()

        res.send("Email verified sucessfully! You can now log in.")
    } catch (error) {
        console.error("Verification error:", error)
        res.status(400).send("Invalid or expired verification token.")
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if(!user)
            return res.status(401).json({ message: "User not found"})

        if(!user.verified)
            return res.status(401).json({message: "Email not verified"})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
            return res.status(401).json({ message: "Invalid credentials"})

        const accessToken = jwt.sign({ _id: user._id, name: user.name, email: user.email, role: user.role}, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "15m"
        })
        const refreshToken = jwt.sign({ _id: user._id, name: user.name, email: user.email, role: user.role}, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role }})
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({error: "Server error during login."})
    }
}

const logoutUser = (req, res) => {
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.json({ message: "Logged out"})
}

const getMe = async (req, res) => {
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json({ message: "No token"})
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

        const user = await User.findById(decoded._id)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const frontendUser = { 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        }

        res.status(200).json(frontendUser)
    } catch (error) {
        console.error("Error in getMe:", error);
        return res.status(403).json({ message: "Invalid token" });
    }
}

const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken
    if(!token) return res.status(401).json({ message: "No refresh token"})
    
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if(err) return res.status(403).json({ message: "Invalid refresh token"})
        const newPayload = { 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role
        };
        const newAccessToken = jwt.sign(newPayload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "15m"
        })
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        })

        res.json({ message: "Token refreshed"})
    })
}

export{ 
    registerUser,
    emailVerifyToken,
    loginUser,
    logoutUser,
    getMe,
    refreshToken
}