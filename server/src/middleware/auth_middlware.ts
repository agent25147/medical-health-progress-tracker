const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        // Check if token is present
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Verify the token
        jwt.verify(token, process.env.JWT_Secret, (err, user) => {
            if (err) {
                return res
                    .status(401)
                    .json({ message: "Failed to authenticate token" });
            } else {
                // If verification is successful, attach the decoded token to the request object
                req.user = user;
                next(); // Call the next middleware function
            }
        });
    } catch (err) {
        console.log("Error: ", err);
        res.status(401).send("Unauthorized");
    }
};

export default authenticate;