import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument, UserRole } from "./schemas/user.schema";
import { userValidationSchema } from "./schemas/user.schema";
import { SportsService } from "../sports/sports.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => SportsService))
    private sportsService: SportsService
  ) {}

  async create(createUserDto: any): Promise<User> {
    const validatedData = await userValidationSchema.validateAsync(
      createUserDto
    );
    // Si el usuario NO es admin, debe tener discipline y debe ser un sport válido
    if (
      !(
        Array.isArray(validatedData.roles) &&
        validatedData.roles.includes(UserRole.ADMIN)
      )
    ) {
      if (!validatedData.discipline) {
        throw new BadRequestException(
          `El campo 'discipline' es obligatorio para usuarios que no son admin.`
        );
      }
      const sports = await this.sportsService.findAll();
      const validSportIds = sports.map((s) => String(s._id));
      // discipline es un array de ObjectId (string)
      const invalid = validatedData.discipline.some((id: string) => !validSportIds.includes(id));
      if (invalid) {
        throw new BadRequestException(
          `Algún id de disciplina no está registrado en deportes.`
        );
      }
    }
    const createdUser = new this.userModel(validatedData);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate({
      path: 'discipline',
      select: '_id name',
    }).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate({
      path: 'discipline',
      select: '_id name',
    }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    // Si no se manda password, quitarlo del objeto antes de validar
    const dto = { ...updateUserDto };
    if (!('password' in dto) || dto.password === undefined || dto.password === null || dto.password === '') {
      delete dto.password;
      // Validar sin password requerido
      const partialSchema = userValidationSchema.fork(['password'], (schema) => schema.optional());
      await partialSchema.validateAsync(dto);
    } else {
      // Validar normalmente (password requerido y con reglas)
      await userValidationSchema.validateAsync(dto);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate({ path: 'discipline', select: '_id name' })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
}
