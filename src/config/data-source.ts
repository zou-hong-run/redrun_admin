import { DataSource } from 'typeorm';
import { getConfiguration } from './configuration';
// import "reflect-metadata"
// import {config} from "dotenv"

// config({path:".env.development"})

export default new DataSource(getConfiguration().database);
