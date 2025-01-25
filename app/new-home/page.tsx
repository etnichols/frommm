import Grid from "@components/Grid";
import Row from "@components/Row";
import Badge from "@components/Badge";
import DefaultLayout from "@components/page/DefaultLayout";

export default async function Page() {
    return (     
        <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/template-app-icon.png">
        <Grid>
        <Row>
          From??? Basketball Quizzes <Badge>{`0.0.2`}</Badge>
        </Row>
      </Grid>
      </DefaultLayout>
      ); 
}
