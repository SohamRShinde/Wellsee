import rateLimit from 'express-rate-limit';

export const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, 
    message: { 
        message: "Too many attempts from this IP, please try again after 15 minutes." 
    },
    standardHeaders: true,
    legacyHeaders: false, 
});

export const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 100,
    message: { 
        message: "You have exceeded the request limit for this hour." 
    },
    standardHeaders: true,
    legacyHeaders: false,
});