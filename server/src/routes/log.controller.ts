import * as express from "express";
import authenticate from "../middleware/auth_middlware";
import { AppDataSource } from "../db_config";
import { User } from "../entity/user";
import { AddLogDto } from "../dto/add_log.dto";
import * as Joi from "joi";
import { HealthLog, scalesMap } from "../entity/health_log";
import { getSocketIO } from '../sockets_setup';

const router = express.Router();

router.get('/log', authenticate, async (req, res) => {
    try {
        const userId = (req.user as User).id;

        const trendData = await AppDataSource.getRepository(HealthLog)
            .createQueryBuilder('log')
            .select('DATE(log.date)', 'date')
            .addSelect('ROUND(AVG(log.mood))', 'averageMood')
            .addSelect('MIN(log.anxietyLevel)', 'minAnxiety')
            .addSelect('MAX(log.anxietyLevel)', 'maxAnxiety')
            .addSelect('ROUND(AVG(log.sleepHours))', 'averageSleepHours')
            .where('log.userId = :userId', { userId })
            .groupBy('DATE(log.date)')
            .orderBy('DATE(log.date)', 'ASC')
            .getRawMany();

        return res.status(200).send(trendData);

    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occured while processing the request');
    }
});

const validValues = (map: Record<number, string>) => {
    return Joi.number().valid(...Object.keys(map).map(Number));
};
const addLogValidator = Joi.object({
    date: Joi.date().required(),
    mood: validValues(scalesMap.mood).required(),
    anxietyLevel: validValues(scalesMap.anxietyLevel).required(),
    sleepHours: Joi.number().min(0).max(24).required(), // Assuming sleep hours must be between 0 and 24
    sleepQuality: validValues(scalesMap.sleepQuality).required(),
    sleepDisturbances: Joi.string().allow('').optional(),
    physicalActivity: Joi.string().allow('').optional(),
    socialInteractionsFrequency: validValues(scalesMap.socialInteractionsFrequency).required(),
    stressLevel: validValues(scalesMap.stressLevel).required(),
    anxietyDepressionSymptoms: Joi.string().allow('').optional(),
});
router.post('/log', authenticate, async (req, res) => {
    try {
        var dto = req.body as AddLogDto;
        const { error, value } = addLogValidator.validate(dto, { abortEarly: true });

        if (error) {
            const errorDetails = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).send(errorDetails.map(x => `${x.message}\n`));
        }
        // get userId from request 
        const userId = (req.user as User).id;

        const healthLogRepository = AppDataSource.getRepository(HealthLog);

        const newLog = await healthLogRepository.create({
            ...dto,
            date: dto.date,
            user: { id: userId }
        });

        var saved = await healthLogRepository.save(newLog);

        if (saved) {
            // emit the signal that data has been saved
            const io = getSocketIO();
            io.emit('NewLog', {});
        }

        return res.status(201).send({ message: 'Log saved successfully' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send('An error occured while processing the request');
    }
});

export default router;