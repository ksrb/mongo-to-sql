import { RequestHandler } from "express";
import { Collection } from "mongodb";
import { Client } from "pg";

export type Student = {
  _id: string;
  firstName: string;
  gpa: number;
  lastName: string;
  middleInitial: string;
  phone: string;
  streetAddress: string;
  zip: string;
};

export type CollectionCallback<T> = (
  collection: Collection<T>
) => RequestHandler;

export type ExtractCollectionType<T> = T extends Collection<infer U> ? U : T;

export type WithMongoCollection<T> = (
  fn: CollectionCallback<ExtractCollectionType<T>>
) => ReturnType<typeof fn>;

export type CollectionAndClientCallback<T> = (
  collection: Collection<T>,
  client: Client
) => RequestHandler;

export type WithCollectionAndClient<T> = (
  fn: CollectionAndClientCallback<ExtractCollectionType<T>>
) => ReturnType<typeof fn>;
