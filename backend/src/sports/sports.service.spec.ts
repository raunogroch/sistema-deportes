import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { SportsService } from "./sports.service";
import { Sport } from "./schemas/sports.schema";

class MockSportModel {
  static find = jest.fn();
  static findById = jest.fn();
  static findByIdAndUpdate = jest.fn();
  static findByIdAndDelete = jest.fn();
  static create = jest.fn();
  save: jest.Mock;
  [key: string]: any;
  constructor(dto?: any) {
    if (dto) {
      Object.assign(this, dto);
    }
    this.save = jest.fn().mockResolvedValue({ _id: "1", ...dto });
  }
}

describe("SportsService", () => {
  let service: SportsService;
  let sportModel: any;

  beforeEach(async () => {
    // Reset all static mocks before each test
    MockSportModel.find.mockReset();
    MockSportModel.findById.mockReset();
    MockSportModel.findByIdAndUpdate.mockReset();
    MockSportModel.findByIdAndDelete.mockReset();
    MockSportModel.create.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportsService,
        { provide: getModelToken(Sport.name), useValue: MockSportModel },
      ],
    }).compile();

    service = module.get<SportsService>(SportsService);
    sportModel = module.get(getModelToken(Sport.name));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("debe crear un sport", async () => {
      const dto = { name: "Natación", description: "Deporte acuático" };
      const created = { _id: "1", ...dto };
      const result = await service.create(dto);
      expect(result).toEqual(created);
    });
  });

  describe("findAll", () => {
    it("debe retornar todos los sports", async () => {
      const sports = [
        { _id: "1", name: "Natación" },
        { _id: "2", name: "Fútbol" },
      ];
      sportModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(sports),
      });
      const result = await service.findAll();
      expect(result).toEqual(sports);
    });
  });

  describe("findOne", () => {
    it("debe retornar un sport por id", async () => {
      const sport = { _id: "1", name: "Natación" };
      sportModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(sport),
      });
      const result = await service.findOne("1");
      expect(result).toEqual(sport);
    });
    it("debe lanzar NotFoundException si no existe", async () => {
      sportModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne("999")).rejects.toThrow("Sport not found");
    });
  });

  describe("update", () => {
    it("debe actualizar un sport", async () => {
      const id = "1";
      const dto = { name: "Natación actualizada" };
      const updated = { _id: id, ...dto };
      sportModel.findByIdAndUpdate.mockResolvedValue(updated);
      const result = await service.update(id, dto);
      expect(result).toEqual(updated);
    });
    it("debe lanzar NotFoundException si no existe", async () => {
      sportModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      try {
        await service.update("999", {});
      } catch (e) {
        expect(e.message).toBe("Sport not found");
      }
    });
  });

  describe("remove", () => {
    it("debe eliminar un sport", async () => {
      const id = "1";
      const deleted = { _id: id, name: "Eliminado" };
      sportModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deleted),
      });
      const result = await service.remove(id);
      expect(result).toBeUndefined();
    });
    it("debe lanzar NotFoundException si no existe", async () => {
      sportModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      try {
        await service.remove("999");
      } catch (e) {
        expect(e.message).toBe("Sport not found");
      }
    });
  });
});
