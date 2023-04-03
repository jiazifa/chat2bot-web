import { Container, SimpleGrid } from '@mantine/core';
import { CardGradient } from '../components/card';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import BotIcon from '../icons/bot.svg';

const data = [{ "title": "The Art of War Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum vitae, odit culpa voluptatibus expedita doloremque doloribus, rem eos dolorem iure dolor delectus voluptatem. Tempore soluta, nihil molestias perspiciatis fuga quod.", "description": "test" },
{ "title": "To Kill a Mockingbird", "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae et nemo error iusto mollitia officiis, quidem minus, ratione placeat aliquam nihil tempore, eum repudiandae laboriosam voluptate. Qui unde expedita corrupti?" },
{ "title": "1984", "description": "A dystopian novel about a totalitarian government." },
{ "title": "The Great Gatsby", "description": "A novel about the American Dream and the excesses of the wealthy elite." }, { "title": "The Catcher in the Rye", "description": "A novel about teenage alienation and rebellion." }, { "title": "Pride and Prejudice", "description": "A novel about the societal expectations and romantic entanglements of the English gentry." }, { "title": "The Lord of the Rings", "description": "An epic fantasy novel about a quest to destroy an evil ring." }, { "title": "The Hitchhiker's Guide to the Galaxy", "description": "A humorous science fiction novel about the adventures of an unwitting human and his alien friend." }, { "title": "The Hunger Games", "description": "A dystopian novel about a society where children are forced to fight to the death in a televised event." }, { "title": "The Diary of a Young Girl", "description": "The diary of Anne Frank, a Jewish girl in hiding during the Nazi occupation of the Netherlands." }, { "title": "The Hobbit", "description": "A fantasy novel about a hobbit's journey to help a group of dwarves reclaim their homeland." }, { "title": "The Picture of Dorian Gray", "description": "A novel about the corruption of a beautiful young man and his soul." }, { "title": "Brave New World", "description": "A dystopian novel about a future society where humans are genetically engineered and conditioned to be content with their lives." }, { "title": "The Adventures of Huckleberry Finn", "description": "A novel about the adventures of a young boy and his friend, a runaway slave, on the Mississippi River." }, { "title": "Frankenstein", "description": "A gothic novel about a scientist who creates a monster and the consequences of his actions." }, { "title": "The Color Purple", "description": "A novel about the struggles of an African American woman in the early 20th century South." }, { "title": "One Hundred Years of Solitude", "description": "A magical realist novel about the Buendia family and the history of the town of Macondo." }]


export default function HomePage() {

  const gridItems = data.map((item) => {
    return (
      <CardGradient icon={<BotIcon />} title={item.title} description={item.description} />
    )
  });
  return (
    <>
      <Container>
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[
            { maxWidth: '62rem', cols: 3, spacing: 'md' },
            { maxWidth: '48rem', cols: 2, spacing: 'sm' },
            { maxWidth: '36rem', cols: 1, spacing: 'sm' },
          ]}
        >
          {gridItems}
        </SimpleGrid>
      </Container>
    </>
  );
}
