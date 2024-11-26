import { seedDatabase } from "~/server/db/seed";

seedDatabase()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .then(() => {
    console.log(
      `Database seeding completed successfully in ${process.env.NODE_ENV} environment!`,
    );
    process.exit(0);
  });
