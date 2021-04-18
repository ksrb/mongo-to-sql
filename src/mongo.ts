import students from "./students";
import { CollectionCallback, Student } from "./types";

const uploadAll: CollectionCallback<Student> = (collection) => async (
  req,
  res
) => {
  for (const student of students) {
    const { _id } = student;
    try {
      await collection.updateOne({ _id }, { $set: student }, { upsert: true });
    } catch (e) {
      // Failed to upload student
      res.status(400).json({
        message: `Fail: student with id: ${_id} failed to upload with error ${e}`,
      });
      return;
    }
  }

  // Successfully uploaded all students
  res.json({ message: `Success: ${students.length} students uploaded` });
};

const deleteAll: CollectionCallback<Student> = (collection) => async (
  req,
  res
) => {
  for (const { _id } of students) {
    try {
      await collection.deleteOne({ _id });
    } catch (e) {
      res.status(400).json({
        message: `Fail: student with id: ${_id} failed to delete with error ${e}`,
      });
      return;
    }
  }

  // Successfully uploaded all students
  res.json({ message: `Success: ${students.length} students deleted` });
};

const getAll: CollectionCallback<Student> = (collection) => async (
  req,
  res
) => {
  try {
    const students = await collection.find().toArray();
    res.json(students);
  } catch (e) {
    res.status(400).json({
      message: `Fail: request for students with error ${e}`,
    });
    return;
  }
};

export default {
  uploadAll,
  deleteAll,
  getAll,
};
