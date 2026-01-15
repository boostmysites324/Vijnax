import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate Career Compass PDF Report
 * Based on the sample reports in /content folder
 */
export async function generateCareerReport(testData, userData) {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      // Collect chunks for buffer
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Helper functions for styling
      const addTitle = (text, size = 24) => {
        doc.fontSize(size)
           .font('Helvetica-Bold')
           .fillColor('#1a1a1a')
           .text(text, { align: 'center' });
        doc.moveDown(0.5);
      };

      const addHeading = (text, size = 16) => {
        doc.fontSize(size)
           .font('Helvetica-Bold')
           .fillColor('#2c3e50')
           .text(text);
        doc.moveDown(0.3);
      };

      const addSubHeading = (text, size = 12) => {
        doc.fontSize(size)
           .font('Helvetica-Bold')
           .fillColor('#34495e')
           .text(text);
        doc.moveDown(0.2);
      };

      const addText = (text, options = {}) => {
        doc.fontSize(options.size || 10)
           .font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
           .fillColor(options.color || '#4a4a4a')
           .text(text, options);
        doc.moveDown(0.3);
      };

      const addDivider = () => {
        doc.moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .strokeColor('#bdc3c7')
           .stroke();
        doc.moveDown(0.5);
      };

      // ============= HEADER =============
      addTitle('Stream Selection & Career Guidance Report');
      doc.moveDown(0.5);

      // Student Information
      addText(`Student Name: ${userData.name || 'N/A'}`, { bold: true, size: 12 });
      addText(`Class: ${userData.profile?.grade || 'N/A'}`, { size: 11 });
      addText(`School: ${userData.profile?.school || 'N/A'}`, { size: 11 });
      addText(`Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, { size: 11 });
      addText(`Assessment ID: ${testData._id.toString().substring(0, 12).toUpperCase()}`, { size: 11 });
      
      doc.moveDown();
      addDivider();

      // ============= EXECUTIVE SUMMARY =============
      addHeading('Executive Summary');
      
      const streamScores = testData.results.streamAnalysis || calculateStreamScores(testData.results);
      const primaryStream = Object.entries(streamScores).sort((a, b) => b[1] - a[1])[0];
      const secondaryStream = Object.entries(streamScores).sort((a, b) => b[1] - a[1])[1];
      
      addText(
        `Based on ${userData.name || 'the student'}'s psychometric assessment, the recommended stream is ` +
        `${primaryStream[0]} as the Primary Fit, with ${secondaryStream[0]} as a Secondary Fit. ` +
        `Overall confidence level: ${primaryStream[1] > 75 ? 'HIGH' : primaryStream[1] > 60 ? 'MEDIUM' : 'MODERATE'}.`
      );

      doc.moveDown();
      addDivider();

      // ============= STREAM FIT ANALYSIS =============
      doc.addPage();
      addHeading('Stream Fit Analysis');
      
      // Create table
      const streams = ['PCM', 'PCB', 'Commerce', 'Humanities'];
      const tableTop = doc.y + 10;
      const colWidths = [120, 100, 100, 150];
      
      // Table header
      doc.fontSize(10).font('Helvetica-Bold');
      let xPos = 50;
      ['Stream', 'Score (%)', 'Fit Level', 'Recommendation'].forEach((header, i) => {
        doc.text(header, xPos, tableTop, { width: colWidths[i], align: 'center' });
        xPos += colWidths[i];
      });
      
      // Table rows
      doc.font('Helvetica').fontSize(9);
      let yPos = tableTop + 25;
      
      streams.forEach(stream => {
        const score = streamScores[stream] || 0;
        const fitLevel = score > 70 ? 'Strong' : score > 55 ? 'Moderate' : 'Weak';
        const recommendation = score > 70 ? 'Primary Fit' : score > 55 ? 'Secondary Fit' : 'Not Recommended';
        
        xPos = 50;
        doc.text(stream, xPos, yPos, { width: colWidths[0], align: 'center' });
        xPos += colWidths[0];
        doc.text(Math.round(score), xPos, yPos, { width: colWidths[1], align: 'center' });
        xPos += colWidths[1];
        doc.text(fitLevel, xPos, yPos, { width: colWidths[2], align: 'center' });
        xPos += colWidths[2];
        doc.text(recommendation, xPos, yPos, { width: colWidths[3], align: 'center' });
        
        yPos += 20;
      });

      doc.y = yPos + 20;
      addDivider();

      // ============= APTITUDE ANALYSIS =============
      addHeading('Aptitude Analysis');
      const aptitudeScores = testData.results.scores.aptitude || {};
      addText(
        `Strong aptitude in ${getTopAptitudeAreas(aptitudeScores).join(', ')} areas. ` +
        `This indicates potential for success in analytical and problem-solving fields.`
      );
      doc.moveDown();

      // ============= CAREER INTERESTS (RIASEC) =============
      addHeading('Career Interests (RIASEC)');
      const riasecScores = testData.results.riasecProfile || {};
      const topInterests = getTopRIASECTypes(riasecScores);
      addText(
        `${topInterests.join(' and ')} orientations are dominant, suggesting strong interest in ` +
        `careers that involve ${getRIASECDescription(topInterests)}.`
      );
      doc.moveDown();

      // ============= PERSONALITY PROFILE =============
      addHeading('Personality Profile (Big Five)');
      const personalityScores = testData.results.personalityProfile || {};
      const personalityTraits = getPersonalityDescription(personalityScores);
      addText(personalityTraits);
      doc.moveDown();

      // ============= DECISION-MAKING & JUDGMENT =============
      addHeading('Decision-Making & Judgment');
      const decisionScore = testData.results.scores.values || 0;
      addText(
        decisionScore > 70 
          ? 'Strong ability to balance ethical reasoning and practical decision-making.'
          : 'Moderate ability to balance ethical reasoning and practical decision-making. Should continue to build confidence in independent judgment.'
      );
      doc.moveDown();

      // ============= EMOTIONAL & SOCIAL INTELLIGENCE =============
      addHeading('Emotional & Social Intelligence');
      const esiScore = testData.results.esiScore || 0;
      addText(
        esiScore > 70
          ? 'Displays strong empathy and teamwork skills. Excellent self-regulation under pressure.'
          : 'Displays empathy and teamwork skills. Needs to strengthen self-regulation under pressure.'
      );
      doc.moveDown();

      // ============= LEARNING ORIENTATION =============
      addHeading('Learning Orientation');
      const learningScore = testData.results.scores.skills || 0;
      addText(
        learningScore > 70
          ? 'Prefers structured learning with strong persistence. Shows self-directed study habits.'
          : 'Prefers structured learning and persistence. Would benefit from developing self-directed study habits.'
      );
      doc.moveDown();

      // ============= WORK VALUES & LIFESTYLE =============
      addHeading('Work Values & Lifestyle');
      const workValues = testData.results.workValues || {};
      addText(getWorkValuesDescription(workValues));
      doc.moveDown();

      addDivider();

      // ============= INTEGRATED CAREER GUIDANCE =============
      doc.addPage();
      addHeading('Integrated Career Guidance');
      addText(
        `${primaryStream[0]} is the strongest recommendation. It combines ` +
        `aptitude strengths, personality traits, and career interests effectively. ` +
        `${secondaryStream[0]} is a secondary option due to moderate alignment.`
      );
      doc.moveDown();

      // ============= PARENTAL NOTE =============
      addHeading('Parental Note');
      addText(
        `Parents are advised to support ${userData.name || 'the student'} in exploring ` +
        `${primaryStream[0]} pathways without undue pressure. While ${primaryStream[0]} is the primary fit, ` +
        `${secondaryStream[0]} may be considered if interests shift. Encourage balanced academics ` +
        `with personality development and healthy routines.`
      );
      doc.moveDown();

      addDivider();

      // ============= DISCLAIMER =============
      addHeading('Disclaimer', 14);
      doc.fontSize(9).font('Helvetica');
      addText(
        'This report is based on a scientifically designed psychometric assessment. ' +
        'The recommendations indicate best-fit academic streams based on responses across ' +
        'aptitude, interests, personality, values, and decision-making dimensions.'
      );
      addText('• Results should be used as guidance, not a final verdict.');
      addText('• Student\'s motivation, effort, and future learning can significantly influence outcomes.');
      addText('• Recommended stream may change as student develops new skills and interests.');
      addText('• Assessment does not measure board exam performance or guarantee admissions.');
      addText('• Parents should consider insights alongside academic records and personal aspirations.');

      doc.moveDown();
      doc.fontSize(8).fillColor('#7f8c8d')
         .text('This report is intended to assist, not replace, informed parental and student choice.', 
               { align: 'center' });

      // ============= FOOTER =============
      doc.fontSize(8).fillColor('#95a5a6')
         .text('Career Compass © 2026 | Powered by Vijnax', 
               50, doc.page.height - 50, 
               { align: 'center', width: doc.page.width - 100 });

      // Finalize PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

// ============= HELPER FUNCTIONS =============

function calculateStreamScores(results) {
  const { scores } = results;
  
  // Calculate stream alignment based on section scores
  const pcmScore = (scores.aptitude * 0.4) + (scores.values * 0.2) + (scores.personality * 0.2) + (scores.skills * 0.2);
  const pcbScore = (scores.aptitude * 0.3) + (scores.values * 0.3) + (scores.personality * 0.2) + (scores.skills * 0.2);
  const commerceScore = (scores.values * 0.4) + (scores.personality * 0.3) + (scores.aptitude * 0.2) + (scores.skills * 0.1);
  const humanitiesScore = (scores.personality * 0.4) + (scores.values * 0.3) + (scores.skills * 0.2) + (scores.aptitude * 0.1);
  
  return {
    'PCM (Science with Maths)': Math.min(pcmScore, 100),
    'PCB (Science with Biology)': Math.min(pcbScore, 100),
    'Commerce': Math.min(commerceScore, 100),
    'Humanities': Math.min(humanitiesScore, 100)
  };
}

function getTopAptitudeAreas(aptitudeScores) {
  const areas = {
    numerical: 'Numerical Reasoning',
    logical: 'Logical Thinking',
    verbal: 'Verbal Comprehension',
    spatial: 'Spatial Ability'
  };
  
  return Object.keys(areas).slice(0, 2).map(key => areas[key]);
}

function getTopRIASECTypes(riasecScores) {
  const types = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional'
  };
  
  const sorted = Object.entries(riasecScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  
  return sorted.map(([key]) => types[key] || key);
}

function getRIASECDescription(interests) {
  const descriptions = {
    'Realistic': 'hands-on work and practical applications',
    'Investigative': 'research, analysis, and problem-solving',
    'Artistic': 'creativity, design, and self-expression',
    'Social': 'helping others and collaborative work',
    'Enterprising': 'leadership, entrepreneurship, and persuasion',
    'Conventional': 'organization, data management, and structured tasks'
  };
  
  return interests.map(i => descriptions[i] || 'diverse activities').join(' and ');
}

function getPersonalityDescription(personalityScores) {
  const traits = [];
  
  if ((personalityScores.C || 0) > 60) traits.push('conscientious and disciplined');
  if ((personalityScores.O || 0) > 60) traits.push('open to new experiences');
  if ((personalityScores.A || 0) > 60) traits.push('agreeable and cooperative');
  if ((personalityScores.E || 0) > 60) traits.push('extraverted and sociable');
  if ((personalityScores.S || 0) > 60) traits.push('emotionally stable');
  
  if (traits.length === 0) return 'Shows balanced personality traits across all dimensions.';
  
  return `Exhibits ${traits.join(', ')} personality traits, which align well with academic and career success.`;
}

function getWorkValuesDescription(workValues) {
  const topValue = Object.entries(workValues)
    .sort((a, b) => b[1] - a[1])[0];
  
  if (!topValue) return 'Values balanced approach to work and life.';
  
  const descriptions = {
    achievement: 'strong drive for accomplishment and recognition',
    stability: 'preference for security and structured environments',
    creativity: 'desire for innovation and self-expression',
    helping: 'commitment to service and supporting others',
    leadership: 'inclination toward influence and decision-making'
  };
  
  return `Values ${descriptions[topValue[0]] || 'meaningful work'}. Prefers collaborative settings with clear goals.`;
}

export default { generateCareerReport };
