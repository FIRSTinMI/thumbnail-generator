import { Container, Title, Checkbox, NativeSelect, Fieldset, TextInput, Button } from '@mantine/core';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Image, Shape, Text } from 'react-konva';
import useImage from 'use-image';
import './App.scss'

//Konva.pixelRatio = 1;
const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;
const LOGO_SIZE_RATIO = 0.5;

function App() {
  const [accent, setAccent] = useState<string>("#009cd7");
  const [overrideProgram, setOverrideProgram] = useState<boolean>(false);
  const [program, setProgram] = useState<string>("FRC");
  const [title, setTitle] = useState<string>("YOUR EVENT NAME HERE");
  const [subtitle, setSubtitle] = useState<string>("DAY 1 -- STATIC CAMERA");

  const [fimLogo] = useImage('/fim-logo-blackonwhite.png');
  const stageRef = useRef<any>(null);

  useEffect(() => {
    setProgram(`${(new Date()).getFullYear()} ${program}`);
  }, []);

  const onProgramDropdownChange = useCallback((value: string) => {
    const setProgramIfAllowed = (prog: string) => {
      if (!overrideProgram) {
        setProgram(`${(new Date()).getFullYear()} ${prog}`)
      }
    };
    if (value === "FTC") {
      setAccent("#f57e25");
      setProgramIfAllowed("FTC");
    } else {
      setAccent("#009cd7");
      setProgramIfAllowed("FRC");
    }
  }, [overrideProgram]);

  const onExport = useCallback(() => {
    const uri = stageRef.current?.toDataURL();
    var link = document.createElement('a');
    link.download = `${title} - ${subtitle.replace(/[-\u2014]/g, '')}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [stageRef, title, subtitle]);

  return (
    <Container>
      <Title order={1} mt="md" mb="sm">FiM Thumbnail Generator</Title>
      <Fieldset>
        <NativeSelect label="Level" data={[
          { label: 'FRC', value: 'FRC' },
          { label: 'FTC', value: 'FTC' }
        ]} onChange={(e) => onProgramDropdownChange(e.target.value)}/>
        <Checkbox
          name="overrideProgram"
          label="Override Program"
          checked={overrideProgram}
          onChange={(e) => setOverrideProgram(e.target.checked)}
          mt="md"
        />
        <TextInput
          name="program"
          label="Program"
          value={program}
          disabled={!overrideProgram}
          onChange={(e) => setProgram(e.target.value)}
          mt="md"
        />
        <TextInput
          name="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mt="md"
        />
        <TextInput
          name="subtitle"
          label="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          mt="md"
        />
        <Button mt="lg" onClick={() => onExport()}>Download</Button>
      </Fieldset>

      <div className="canvas">
        <p>Preview</p>
        <Stage width={IMAGE_WIDTH} height={IMAGE_HEIGHT} ref={stageRef}>
          <Layer>
            {/* White background */}
            <Rect width={IMAGE_WIDTH} height={IMAGE_HEIGHT} fill="white" />
            
            {/* Angled color bar on left side */}
            <Shape width={IMAGE_WIDTH} height={IMAGE_HEIGHT} fill={accent} sceneFunc={(ctx, shape) => {
              const width = shape.width();
              const height = shape.height();
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(0, height);
              ctx.lineTo(width * 0.05, height);
              ctx.lineTo(width * 0.2, 0);
              ctx.closePath();

              ctx.fillStrokeShape(shape);
            }} />

            {/* Logo */}
            <Image
              image={fimLogo}
              offsetX={fimLogo ? (fimLogo!.width/fimLogo!.height)*(IMAGE_HEIGHT*LOGO_SIZE_RATIO*0.5) : 0}
              offsetY={IMAGE_HEIGHT*LOGO_SIZE_RATIO*0.5} x={IMAGE_WIDTH * 0.55}
              y={IMAGE_HEIGHT * 0.3}
              width={IMAGE_HEIGHT*LOGO_SIZE_RATIO}
              height={fimLogo ? (fimLogo!.width/fimLogo!.height)*(IMAGE_HEIGHT*LOGO_SIZE_RATIO) : 0}
            />

            {/* User-controllable text */}
            <Text x={IMAGE_WIDTH * 0.55} y={IMAGE_HEIGHT*0.5} width={IMAGE_WIDTH*0.5} offsetX={IMAGE_WIDTH*0.5*0.5} text={program.toLocaleUpperCase()} fontSize={IMAGE_HEIGHT*0.05} align="center" />
            <Text x={IMAGE_WIDTH * 0.55} y={IMAGE_HEIGHT*0.65} text={title.toLocaleUpperCase()} wrap="word" width={IMAGE_WIDTH*0.5} height={IMAGE_HEIGHT*0.2} offsetX={IMAGE_WIDTH*0.5*0.5} fontSize={IMAGE_HEIGHT*0.1} fontStyle="600" align="center" verticalAlign="bottom" />
            <Text x={IMAGE_WIDTH * 0.55} y={IMAGE_HEIGHT*0.87} text={subtitle.replace(/--/g, '\u2014').toLocaleUpperCase()} wrap="word" width={IMAGE_WIDTH*0.5} offsetX={IMAGE_WIDTH*0.5*0.5} fontSize={IMAGE_HEIGHT*0.05} fontStyle="400" align="center" />
          </Layer>
        </Stage>
      </div>
    </Container>
  )
}

export default App
