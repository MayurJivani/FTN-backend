const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.auth = (req, res, next) => {
    try {
        
        const token = req.body?.token || req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is Missing'
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            next();
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
              return res.status(401).json({ message: 'Token has expired' });
            } else if (error.name === 'JsonWebTokenError') {
              return res.status(401).json({ message: 'Invalid token' });
            } else {
              return res.status(500).json({ message: 'Server Error' });
            }
        }
    }
    catch (error) {
        console.log('Error while token validating');
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while token validating'
        })
    }
}