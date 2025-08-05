import { Test, TestingModule } from "@nestjs/testing";
import { SportsController } from "./sports.controller";
import { SportsService } from "./sports.service";
import { UserRole } from "../users/schemas/user.schema";

describe("SportsController", () => {
  let controller: SportsController;
  let service: SportsService;

  const mockSportsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportsController],
      providers: [{ provide: SportsService, useValue: mockSportsService }],
    }).compile();

    controller = module.get<SportsController>(SportsController);
    service = module.get<SportsService>(SportsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("debe crear un sport", async () => {
      const dto = { name: "Natación", description: "Deporte acuático" };
      const created = { _id: "1", ...dto };
      mockSportsService.create.mockResolvedValueOnce(created);
      const result = await controller.create(dto);
      expect(result).toEqual(created);
      expect(mockSportsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe("findAll", () => {
    it("debe retornar todos los sports", async () => {
      const sports = [
        { _id: "1", name: "Natación" },
        { _id: "2", name: "Fútbol" },
      ];
      mockSportsService.findAll.mockResolvedValueOnce(sports);
      const result = await controller.findAll();
      expect(result).toEqual(sports);
      expect(mockSportsService.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("debe retornar un sport por id", async () => {
      const sport = { _id: "1", name: "Natación" };
      mockSportsService.findOne.mockResolvedValueOnce(sport);
      const result = await controller.findOne("1");
      expect(result).toEqual(sport);
      expect(mockSportsService.findOne).toHaveBeenCalledWith("1");
    });
  });

  describe("update", () => {
    it("debe actualizar un sport", async () => {
      const id = "1";
      const dto = { name: "Natación actualizada" };
      const updated = { _id: id, ...dto };
      mockSportsService.update.mockResolvedValueOnce(updated);
      const result = await controller.update(id, dto);
      expect(result).toEqual(updated);
      expect(mockSportsService.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe("remove", () => {
    it("debe eliminar un sport", async () => {
      const id = "1";
      mockSportsService.remove.mockResolvedValueOnce(undefined);
      const result = await controller.remove(id);
      expect(result).toBeUndefined();
      expect(mockSportsService.remove).toHaveBeenCalledWith(id);
    });
  });
});
