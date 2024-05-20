-- CreateTable
CREATE TABLE "character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT,
    "ability" TEXT NOT NULL,
    "minimal_distance" DECIMAL NOT NULL,
    "weight" DECIMAL,
    "born" TIMESTAMP(6) NOT NULL,
    "in_space_since" TIMESTAMP(6),
    "beer_consumption" INTEGER NOT NULL,
    "knows_the_answer" BOOLEAN NOT NULL,

    CONSTRAINT "character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nemesis" (
    "is_alive" BOOLEAN NOT NULL,
    "years" INTEGER,
    "id" SERIAL NOT NULL,
    "character_id" INTEGER,

    CONSTRAINT "nemesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secret" (
    "id" SERIAL NOT NULL,
    "secret_code" BIGINT NOT NULL,
    "nemesis_id" INTEGER NOT NULL,

    CONSTRAINT "secret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fki_Character Id" ON "nemesis"("id");

-- AddForeignKey
ALTER TABLE "nemesis" ADD CONSTRAINT "character" FOREIGN KEY ("character_id") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "secret" ADD CONSTRAINT "nemesis" FOREIGN KEY ("nemesis_id") REFERENCES "nemesis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
