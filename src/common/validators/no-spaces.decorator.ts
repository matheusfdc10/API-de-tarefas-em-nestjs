import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Decorador customizado para verificar se uma string não contém espaços.
 * @param validationOptions Opções de validação do class-validator
 */
export function NoSpaces(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      name: 'noSpaces',
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value === 'number' || typeof value === 'string') {
            const stringValue = value.toString();
            return !/\s/.test(stringValue); // Retorna true se não houver espaços
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} cannot contain spaces`;
        },
      },
    });
  };
}
