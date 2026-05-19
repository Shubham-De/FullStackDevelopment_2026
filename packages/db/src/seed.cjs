module.exports.seed = async function seed(...args) {
  const seedModule = await import("../dist/seed.js");
  return seedModule.seed(...args);
};
