import { Router } from 'express';
import { 
    register, 
    resendVerification, 
    confirmVerification, 
    checkApi, 
    login,  
    changePassword,
    changeApi,
    update,
    deleteUser,
} from "../controllers/UserController";

const router = Router();

router.post("/register", register);

router.post("/resendVerification", resendVerification);

router.post("/confirmVerification", confirmVerification);

router.post("/checkApi", checkApi);

router.post("/login", login);

router.post("/changePassword", changePassword);

router.post("/changeApi", changeApi);

router.post("/update", update);

router.post("/deleteUser", deleteUser);

export default router;