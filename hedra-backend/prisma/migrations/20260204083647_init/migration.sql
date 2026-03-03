-- CreateEnum
CREATE TYPE "CatalogueType" AS ENUM ('CHAIR_CATALOGUE', 'UPHOLSTERY', 'BRAND_LOGO');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "bestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specifications" JSONB;

-- CreateTable
CREATE TABLE "Catalogue" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "CatalogueType" NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "brandLogoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Catalogue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Catalogue_code_key" ON "Catalogue"("code");
