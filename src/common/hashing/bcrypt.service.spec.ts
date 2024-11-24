import { BcryptService } from './bcrypt.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt'); // Mocka o pacote bcrypt

describe('BcryptService', () => {
  let bcryptService: BcryptService;

  beforeEach(() => {
    bcryptService = new BcryptService();
  });

  describe('hash', () => {
    it('should generate a hash for the given password', async () => {
      const mockSalt = 'mockSalt';
      const mockHash = 'mockHash';

      // Tipo explícito para os mocks
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const password = 'password123';
      const result = await bcryptService.hash(password);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, mockSalt);
      expect(result).toBe(mockHash);
    });
  });

  describe('compare', () => {
    it('should return true if the passwords match', async () => {
      // Tipo explícito para o mock
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const password = 'password123';
      const passwordHash = 'hashedPassword';

      const result = await bcryptService.compare(password, passwordHash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash);
      expect(result).toBe(true);
    });

    it('should return false if the passwords do not match', async () => {
      // Tipo explícito para o mock
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const password = 'password123';
      const passwordHash = 'hashedPassword';

      const result = await bcryptService.compare(password, passwordHash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash);
      expect(result).toBe(false);
    });
  });
});
