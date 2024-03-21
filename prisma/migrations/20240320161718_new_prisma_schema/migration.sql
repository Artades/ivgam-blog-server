-- CreateTable
CREATE TABLE "Favorites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritePost" (
    "id" SERIAL NOT NULL,
    "favoritesId" INTEGER NOT NULL,
    "articleNumber" INTEGER NOT NULL,

    CONSTRAINT "FavoritePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "dateOfCreation" TEXT NOT NULL,
    "dateOfUpdation" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "hashtags" TEXT[],
    "views" INTEGER NOT NULL,
    "likesAmount" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritePost" ADD CONSTRAINT "FavoritePost_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
