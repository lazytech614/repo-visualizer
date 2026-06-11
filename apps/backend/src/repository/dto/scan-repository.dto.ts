import {
  IsIn,
  IsOptional,
  IsString,
} from "class-validator";

export class ScanRepositoryDto {
  @IsIn([
    "local",
    "github",
  ])
  source!: "local" | "github";

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;
}