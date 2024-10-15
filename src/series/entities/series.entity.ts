import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  releaseDate: Date;

  @Column()
  imageUrl: string;

  @Column()
  trailerUrl: string;

  @Column()
  timeForNextEpisode: string;
}
