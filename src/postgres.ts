import { CollectionAndClientCallback, Student } from "./types";

export const duplicateAllFromMongo: CollectionAndClientCallback<Student> = (
  collection,
  client
) => async (req, res) => {
  // Create table
  try {
    await client.query("BEGIN");
    await client.query(
      `CREATE TABLE IF NOT EXISTS students
             (
               _id           uuid PRIMARY KEY,
               firstName     VARCHAR(255) NOT NULL,
               gpa           decimal      NOT NULL,
               lastName      VARCHAR(255) NOT NULL,
               middleInitial VARCHAR(255) NOT NULL,
               phone         VARCHAR(255) NOT NULL,
               zip           VARCHAR(255) NOT NULL,
               streetAddress VARCHAR(255) NOT NULL
            );`
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
  }

  // Get students from mongo
  const students = await collection.find().toArray();

  // Upload students to postgres
  for (const student of students) {
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO students(
                _id,
                firstName,
                gpa,
                lastName,
                middleInitial,
                phone,
                streetAddress,
                zip
              ) values (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
              );`,
        [
          student._id,
          student.firstName,
          student.gpa,
          student.lastName,
          student.middleInitial,
          student.phone,
          student.streetAddress,
          student.zip,
        ]
      );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      res.status(500).json({
        message: `Fail: student with id: ${student._id} failed to duplicate with error: ${e}`,
      });
      return;
    }
  }

  res.json({ message: `Success: duplicated ${students.length} students` });
};

const getAll: CollectionAndClientCallback<Student> = (
  collection,
  client
) => async (req, res) => {
  try {
    const { rows } = await client.query("SELECT * FROM students;");
    res.json(rows);
  } catch (e) {
    res.status(500).json({
      message: `Fail: request for students failed with error: ${e}`,
    });
    return;
  }
};

const deleteAll: CollectionAndClientCallback<Student> = (
  collection,
  client
) => async (req, res) => {
  try {
    await client.query("BEGIN");
    await client.query("DROP TABLE students;");
    await client.query("COMMIT");
    res.json({ message: "Success: student table dropped" });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({
      message: `Fail: drop student table failed with error ${e}`,
    });
    return;
  }
};
export default {
  duplicateAllFromMongo,
  getAll,
  deleteAll,
};
