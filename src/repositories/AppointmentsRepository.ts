import Appointment from '../models/Appointment';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
    public async findByDate(date: Date): Promise<Appointment | null> {
        const appointment = await this.findOne({
            where: {
                date
            },
        })

        return appointment || null;
    }
}

export default AppointmentsRepository;