export function timeIt(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    try {
      return await original.apply(this, args);
    } finally {
      const ms = Date.now() - start;
      console.log(`Execution time - ${propertyKey}: ${ms}ms`);
    }
  };
  return descriptor;
}
