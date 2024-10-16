import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Episode } from './episode.entity';

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
  genres: string;

  @OneToMany(() => Episode, (episode) => episode.series)
  episodes: Episode[];

  @Column()
  href: string;
}
